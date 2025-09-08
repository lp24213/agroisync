import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Newspaper, Clock } from 'lucide-react'

const NewsFeed = () => {
  const [news, setNews] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Dados mockados de notícias (em produção, usar API do Globo Rural)
    const mockNewsData = [
      {
        id: 1,
        title: 'Soja atinge maior preço em 3 meses com alta da demanda chinesa',
        summary: 'Commodity brasileira registra valorização de 8% na semana',
        source: 'Globo Rural',
        publishedAt: '2024-01-15T10:30:00Z',
        url: '#',
        category: 'Commodities'
      },
      {
        id: 2,
        title: 'Tecnologia 5G revoluciona monitoramento de safras no Brasil',
        summary: 'Fazendas conectadas aumentam produtividade em 15%',
        source: 'AgroRevista',
        publishedAt: '2024-01-15T09:15:00Z',
        url: '#',
        category: 'Tecnologia'
      },
      {
        id: 3,
        title: 'Chuva em excesso preocupa produtores de milho no Centro-Oeste',
        summary: 'Previsão indica mais 10 dias de precipitação intensa',
        source: 'Canal Rural',
        publishedAt: '2024-01-15T08:45:00Z',
        url: '#',
        category: 'Clima'
      },
      {
        id: 4,
        title: 'Exportações de carne bovina crescem 12% em dezembro',
        summary: 'China continua sendo o principal destino das exportações',
        source: 'AgroLink',
        publishedAt: '2024-01-15T07:20:00Z',
        url: '#',
        category: 'Exportações'
      }
    ]

    const loadNews = async () => {
      try {
        // Em produção, fazer chamada para API do Globo Rural ou similar
        // const response = await fetch('https://api.globorural.com.br/...')
        // const data = await response.json()

        // Por enquanto, usar dados mockados
        setTimeout(() => {
          setNews(mockNewsData)
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Erro ao carregar notícias:', error)
        setNews(mockNewsData)
        setIsLoading(false)
      }
    }

    loadNews()

    // Atualizar notícias a cada 15 minutos
    const interval = setInterval(loadNews, 900000)

    return () => clearInterval(interval)
  }, [])

  const formatTimeAgo = dateString => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Agora há pouco'
    if (diffInHours < 24) return `${diffInHours}h atrás`

    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d atrás`
  }

  if (isLoading) {
    return (
      <div className='news-feed'>
        <div className='flex items-center gap-4'>
          <div className='h-4 w-4 animate-pulse rounded bg-gray-200'></div>
          <div className='h-4 w-48 animate-pulse rounded bg-gray-200'></div>
        </div>
      </div>
    )
  }

  return (
    <div className='news-feed'>
      <div className='flex items-center gap-4 text-sm'>
        <div className='flex items-center gap-2'>
          <Newspaper size={14} className='text-primary' />
          <span className='text-primary font-semibold'>Notícias do Agronegócio</span>
        </div>

        {news.slice(0, 3).map((article, index) => (
          <motion.div
            key={article.id}
            className='flex items-center gap-2'
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <span className='bg-primary rounded-full px-2 py-1 text-xs text-white'>{article.category}</span>
            <span className='text-primary max-w-xs truncate font-medium'>{article.title}</span>
            <div className='text-muted flex items-center gap-1'>
              <Clock size={12} />
              <span className='text-xs'>{formatTimeAgo(article.publishedAt)}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default NewsFeed
