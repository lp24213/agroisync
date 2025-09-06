import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Newspaper, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

const AgroNews = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchAgroNews();
  }, []);

  const fetchAgroNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simular dados de notícias (em produção, usar RSS real)
      const mockNews = [
        {
          id: 1,
          title: "Soja atinge maior preço em 3 meses com alta da demanda chinesa",
          summary: "Commodity registra valorização de 8% na semana, impulsionada por compras recordes da China e estoques baixos nos EUA.",
          link: "#",
          date: "2024-01-25"
        },
        {
          id: 2,
          title: "Novas tecnologias de irrigação reduzem consumo de água em 40%",
          summary: "Sistema inteligente desenvolvido por startup brasileira promete revolucionar agricultura em regiões áridas.",
          link: "#",
          date: "2024-01-24"
        },
        {
          id: 3,
          title: "Exportações de carne bovina crescem 15% no primeiro mês do ano",
          summary: "Setor registra forte recuperação com abertura de novos mercados e melhoria na qualidade dos produtos.",
          link: "#",
          date: "2024-01-23"
        }
      ];
      
      setNews(mockNews);
    } catch (error) {
      console.error('Erro ao carregar notícias:', error);
      setError('Erro ao carregar notícias do agronegócio');
    } finally {
      setLoading(false);
    }
  };

  const nextNews = () => {
    setCurrentIndex((prev) => (prev + 1) % news.length);
  };

  const prevNews = () => {
    setCurrentIndex((prev) => (prev - 1 + news.length) % news.length);
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4"></div>
            <div className="h-6 bg-white/20 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-white/20 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="bg-red-600 rounded-2xl p-8 text-center text-white">
          <p className="text-lg font-semibold">{error}</p>
          <button 
            onClick={fetchAgroNews}
            className="mt-4 px-6 py-2 bg-white text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (!news.length) {
    return null;
  }

  const currentNews = news[currentIndex];

  return (
    <section className="py-16 px-4">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header da Seção */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white mb-6">
            <Newspaper className="w-10 h-10" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Últimas do Agronegócio
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Fique por dentro das principais notícias e tendências do setor agrícola brasileiro
          </p>
        </motion.div>

        {/* Carrossel de Notícias */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white shadow-2xl">
            {/* Controles de Navegação */}
            <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
              <button
                onClick={prevNews}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200"
                aria-label={t('ui.label.previousNews')}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>
            
            <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
              <button
                onClick={nextNews}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200"
                aria-label={t('ui.label.nextNews')}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Conteúdo da Notícia */}
            <div className="text-center max-w-4xl mx-auto">
              <motion.div
                key={currentNews.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
                  {currentNews.title}
                </h3>
                <p className="text-lg text-green-100 leading-relaxed mb-6">
                  {currentNews.summary}
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm text-green-200">
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
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-8 py-3 bg-white text-green-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <span>Ler Notícia Completa</span>
                  <ExternalLink className="w-5 h-5" />
                </a>
              </motion.div>
            </div>

            {/* Indicadores de Página */}
            <div className="flex justify-center space-x-2 mt-8">
              {news.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-white scale-125' 
                      : 'bg-white/40 hover:bg-white/60'
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
          className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {news.map((newsItem, index) => (
            <motion.div
              key={newsItem.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-3">
                  {newsItem.title}
                </h4>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {newsItem.summary}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {new Date(newsItem.date).toLocaleDateString('pt-BR')}
                  </span>
                  <a
                    href={newsItem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center space-x-1"
                  >
                    <span>Ler mais</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AgroNews;
