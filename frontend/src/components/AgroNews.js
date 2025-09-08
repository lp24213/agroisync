import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import { Newspaper, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'

const AgroNews = () => {
  const { isDark } = useTheme()
  const { t } = useLanguage()
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    fetchAgroNews()
  }, [])

  const fetchAgroNews = async () => {
    try {
      setLoading(true)
      setError(null)

      // Simular dados de notícias (em produção, usar RSS real)
      const mockNews = [
        {
          id: 1,
          title: 'Soja atinge maior preço em 3 meses com alta da demanda chinesa',
          summary:
            'Commodity registra valorização de 8% na semana, impulsionada por compras recordes da China e estoques baixos nos EUA.',
          link: '#',
          date: '2024-01-25'
        },
        {
          id: 2,
          title: 'Novas tecnologias de irrigação reduzem consumo de água em 40%',
          summary:
            'Sistema inteligente desenvolvido por startup brasileira promete revolucionar agricultura em regiões áridas.',
          link: '#',
          date: '2024-01-24'
        },
        {
          id: 3,
          title: 'Exportações de carne bovina crescem 15% no primeiro mês do ano',
          summary:
            'Setor registra forte recuperação com abertura de novos mercados e melhoria na qualidade dos produtos.',
          link: '#',
          date: '2024-01-23'
        }
      ]

      setNews(mockNews)
    } catch (error) {
      console.error('Erro ao carregar notícias:', error)
      setError('Erro ao carregar notícias do agronegócio')
    } finally {
      setLoading(false)
    }
  }

  const nextNews = () => {
    setCurrentIndex(prev => (prev + 1) % news.length)
  }

  const prevNews = () => {
    setCurrentIndex(prev => (prev - 1 + news.length) % news.length)
  }

  if (loading) {
    return (
      <div className='mx-auto w-full max-w-4xl px-4'>
        <div className='rounded-2xl bg-gradient-to-r from-green-600 to-blue-600 p-8 text-center'>
          <div className='animate-pulse'>
            <div className='mx-auto mb-4 h-16 w-16 rounded-full bg-white/20'></div>
            <div className='mx-auto mb-2 h-6 w-3/4 rounded bg-white/20'></div>
            <div className='mx-auto h-4 w-1/2 rounded bg-white/20'></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='mx-auto w-full max-w-4xl px-4'>
        <div className='rounded-2xl bg-red-600 p-8 text-center text-white'>
          <p className='text-lg font-semibold'>{error}</p>
          <button
            onClick={fetchAgroNews}
            className='mt-4 rounded-lg bg-white px-6 py-2 text-red-600 transition-colors hover:bg-gray-100'
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  if (!news.length) {
    return null
  }

  const currentNews = news[currentIndex]

  return (
    <section className='px-4 py-16'>
      <div className='mx-auto w-full max-w-6xl'>
        {/* Header da Seção */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='mb-12 text-center'
        >
          <div className='mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white'>
            <Newspaper className='h-10 w-10' />
          </div>
          <h2 className='mb-4 text-4xl font-bold text-gray-900'>Últimas do Agronegócio</h2>
          <p className='mx-auto max-w-3xl text-xl text-gray-600'>
            Fique por dentro das principais notícias e tendências do setor agrícola brasileiro
          </p>
        </motion.div>

        {/* Carrossel de Notícias */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='relative'
        >
          <div className='rounded-2xl bg-gradient-to-r from-green-600 to-blue-600 p-8 text-white shadow-2xl'>
            {/* Controles de Navegação */}
            <div className='absolute left-4 top-1/2 -translate-y-1/2 transform'>
              <button
                onClick={prevNews}
                className='rounded-full bg-white/20 p-2 transition-colors duration-200 hover:bg-white/30'
                aria-label={t('ui.label.previousNews')}
              >
                <ChevronLeft className='h-6 w-6' />
              </button>
            </div>

            <div className='absolute right-4 top-1/2 -translate-y-1/2 transform'>
              <button
                onClick={nextNews}
                className='rounded-full bg-white/20 p-2 transition-colors duration-200 hover:bg-white/30'
                aria-label={t('ui.label.nextNews')}
              >
                <ChevronRight className='h-6 w-6' />
              </button>
            </div>

            {/* Conteúdo da Notícia */}
            <div className='mx-auto max-w-4xl text-center'>
              <motion.div
                key={currentNews.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className='mb-6'
              >
                <h3 className='mb-4 text-2xl font-bold leading-tight md:text-3xl'>{currentNews.title}</h3>
                <p className='mb-6 text-lg leading-relaxed text-green-100'>{currentNews.summary}</p>
                <div className='flex items-center justify-center space-x-4 text-sm text-green-200'>
                  <span>{new Date(currentNews.date).toLocaleDateString('pt-BR')}</span>
                  <span>•</span>
                  <span>Agronegócio</span>
                </div>
              </motion.div>

              {/* Botão de Leitura */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <a
                  href={currentNews.link}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center space-x-2 rounded-xl bg-white px-8 py-3 font-semibold text-green-600 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100'
                >
                  <span>Ler Notícia Completa</span>
                  <ExternalLink className='h-5 w-5' />
                </a>
              </motion.div>
            </div>

            {/* Indicadores de Página */}
            <div className='mt-8 flex justify-center space-x-2'>
              {news.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-3 w-3 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'scale-125 bg-white' : 'bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Ir para notícia ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Notícias Secundárias */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className='mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'
        >
          {news.map((newsItem, index) => (
            <motion.div
              key={newsItem.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className='rounded-xl border border-gray-100 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'
            >
              <div className='p-6'>
                <h4 className='mb-3 line-clamp-3 text-lg font-semibold text-gray-900'>{newsItem.title}</h4>
                <p className='mb-4 line-clamp-3 text-sm text-gray-600'>{newsItem.summary}</p>
                <div className='flex items-center justify-between'>
                  <span className='text-xs text-gray-500'>{new Date(newsItem.date).toLocaleDateString('pt-BR')}</span>
                  <a
                    href={newsItem.link}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center space-x-1 text-sm font-medium text-green-600 hover:text-green-700'
                  >
                    <span>Ler mais</span>
                    <ExternalLink className='h-4 w-4' />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default AgroNews
