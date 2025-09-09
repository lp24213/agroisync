import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Clock, TrendingUp } from 'lucide-react';

const Noticias = () => {
  const [news, setNews] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Simular dados de notícias
    const mockNews = [
      {
        id: 1,
        title: 'Soja atinge maior preço em 3 meses com alta da demanda chinesa',
        category: 'Commodities',
        timeAgo: '2h atrás',
        summary: 'Preços da soja subiram 3.2% nesta semana devido ao aumento da demanda chinesa e problemas climáticos nos EUA.',
        link: '#'
      },
      {
        id: 2,
        title: 'Novo sistema de irrigação inteligente reduz custos em 40%',
        category: 'Tecnologia',
        timeAgo: '4h atrás',
        summary: 'Fazendas que implementaram o sistema de irrigação por IoT reportaram economia significativa nos custos operacionais.',
        link: '#'
      },
      {
        id: 3,
        title: 'Milho: expectativa de safra recorde no Mato Grosso',
        category: 'Produção',
        timeAgo: '6h atrás',
        summary: 'Estimativas apontam para uma safra de milho 15% maior que o ano anterior no estado do Mato Grosso.',
        link: '#'
      },
      {
        id: 4,
        title: 'Agronegócio brasileiro cresce 8.5% no primeiro trimestre',
        category: 'Economia',
        timeAgo: '8h atrás',
        summary: 'Setor do agronegócio registrou crescimento robusto, impulsionado pelas exportações e tecnologia.',
        link: '#'
      },
      {
        id: 5,
        title: 'Sustentabilidade: fazendas adotam práticas carbono neutro',
        category: 'Sustentabilidade',
        timeAgo: '12h atrás',
        summary: 'Cada vez mais produtores investem em práticas sustentáveis para neutralizar emissões de carbono.',
        link: '#'
      }
    ];

    // Simular dados do gráfico
    const mockChartData = [
      { name: 'Soja', value: 85, change: 3.2 },
      { name: 'Milho', value: 72, change: 1.8 },
      { name: 'Café', value: 68, change: -0.5 },
      { name: 'Açúcar', value: 45, change: 2.1 },
      { name: 'Algodão', value: 38, change: 0.8 }
    ];

    setNews(mockNews);
    setChartData(mockChartData);
  }, []);

  const getTimeAgoColor = (timeAgo) => {
    if (timeAgo.includes('h')) {
      const hours = parseInt(timeAgo);
      if (hours <= 2) return '#059669';
      if (hours <= 6) return '#d97706';
      return '#6b7280';
    }
    return '#6b7280';
  };

  return (
    <section className="noticias-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2>Notícias do Agronegócio</h2>
          <p className="text-muted">
            Mantenha-se atualizado com as últimas novidades do setor
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Notícias */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {news.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="panel hover-lift"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span 
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{ 
                          backgroundColor: 'var(--bg)', 
                          color: 'var(--muted)' 
                        }}
                      >
                        {article.category}
                      </span>
                      <div className="flex items-center gap-1 text-sm text-muted">
                        <Clock size={14} />
                        <span style={{ color: getTimeAgoColor(article.timeAgo) }}>
                          {article.timeAgo}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-muted mb-4">
                    {article.summary}
                  </p>
                  
                  <a 
                    href={article.link}
                    className="btn btn-secondary btn-sm"
                  >
                    Leia mais
                    <ExternalLink size={14} />
                  </a>
                </motion.article>
              ))}
            </div>
          </div>

          {/* Gráfico Interativo */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="panel"
            >
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp size={20} className="text-muted" />
                <h3>Tendências do Mercado</h3>
              </div>
              
              <div className="space-y-4">
                {chartData.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="chart-item"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{item.name}</span>
                      <span 
                        className={`text-sm font-medium ${
                          item.change >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {item.change >= 0 ? '+' : ''}{item.change}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.value}%` }}
                        transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                        viewport={{ once: true }}
                        className="h-2 rounded-full"
                        style={{
                          background: item.change >= 0 
                            ? 'linear-gradient(90deg, #059669, #10b981)'
                            : 'linear-gradient(90deg, #dc2626, #ef4444)'
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg)' }}>
                <p className="text-sm text-muted text-center">
                  Dados atualizados em tempo real
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .noticias-section {
          padding: var(--spacing-xl) 0;
          background: var(--bg);
        }
        
        .chart-item {
          padding: var(--spacing-sm) 0;
        }
        
        .text-green-600 {
          color: #059669;
        }
        
        .text-red-600 {
          color: #dc2626;
        }
      `}</style>
    </section>
  );
};

export default Noticias;
