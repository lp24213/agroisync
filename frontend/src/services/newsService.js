// Serviço para notícias do agronegócio
class NewsService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 1800000; // 30 minutos
    this.newsSources = [
      {
        name: 'Globo Rural',
        url: 'https://g1.globo.com/economia/agronegocios/',
        type: 'rss',
        rssUrl: 'https://g1.globo.com/rss/g1/economia/agronegocios/'
      },
      {
        name: 'Agrolink',
        url: 'https://www.agrolink.com.br/noticias',
        type: 'api',
        apiUrl: 'https://api.agrolink.com.br/news'
      },
      {
        name: 'Canal Rural',
        url: 'https://www.canalrural.com.br/noticias',
        type: 'scrape'
      },
      {
        name: 'Notícias Agrícolas',
        url: 'https://www.noticiasagricolas.com.br/noticias',
        type: 'scrape'
      }
    ];
  }

  // Obter notícias principais do agronegócio
  async getMainNews(limit = 10) {
    try {
      const cacheKey = `main-news-${limit}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) return cached;

      // Tentar obter notícias reais primeiro
      let news = [];
      
      try {
        // Tentar RSS do Globo Rural
        news = await this.getGloboRuralNews(limit);
      } catch (error) {
        console.warn('Falha ao obter notícias do Globo Rural, usando fallback:', error);
        news = await this.getSimulatedNews(limit);
      }
      
      this.setCachedData(cacheKey, news);
      return news;
    } catch (error) {
      console.error('Erro ao obter notícias principais:', error);
      return this.getFallbackNews(limit);
    }
  }

  // Obter notícias do Globo Rural via RSS
  async getGloboRuralNews(limit = 10) {
    try {
      // Em produção, usar um proxy CORS ou backend para fazer a requisição
      const response = await fetch('/api/news/globo-rural', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Falha ao obter notícias do Globo Rural');
      }

      const data = await response.json();
      return this.formatGloboRuralNews(data, limit);
    } catch (error) {
      console.error('Erro ao obter notícias do Globo Rural:', error);
      throw error;
    }
  }

  // Formatar notícias do Globo Rural
  formatGloboRuralNews(data, limit) {
    if (!data.items || !Array.isArray(data.items)) {
      return this.getFallbackNews(limit);
    }

    return data.items.slice(0, limit).map(item => ({
      id: item.guid || item.link,
      title: item.title,
      description: item.description || item.contentSnippet,
      content: item.content,
      link: item.link,
      publishedAt: new Date(item.pubDate),
      source: 'Globo Rural',
      category: this.categorizeNews(item.title, item.description),
      image: this.extractImageFromContent(item.content) || '/images/news-placeholder.jpg',
      author: item.author || 'Globo Rural',
      readTime: this.calculateReadTime(item.content || item.description)
    }));
  }

  // Categorizar notícias baseado no título e descrição
  categorizeNews(title, description) {
    const text = `${title} ${description}`.toLowerCase();
    
    if (text.includes('soja') || text.includes('soybean')) return 'soja';
    if (text.includes('milho') || text.includes('corn')) return 'milho';
    if (text.includes('café') || text.includes('coffee')) return 'café';
    if (text.includes('cana') || text.includes('sugarcane')) return 'cana';
    if (text.includes('gado') || text.includes('cattle')) return 'gado';
    if (text.includes('tecnologia') || text.includes('technology')) return 'tecnologia';
    if (text.includes('mercado') || text.includes('market')) return 'mercado';
    if (text.includes('clima') || text.includes('weather')) return 'clima';
    if (text.includes('exportação') || text.includes('export')) return 'exportação';
    if (text.includes('importação') || text.includes('import')) return 'importação';
    
    return 'geral';
  }

  // Extrair imagem do conteúdo HTML
  extractImageFromContent(content) {
    if (!content) return null;
    
    const imgMatch = content.match(/<img[^>]+src="([^"]+)"/i);
    return imgMatch ? imgMatch[1] : null;
  }

  // Calcular tempo de leitura
  calculateReadTime(content) {
    if (!content) return 2;
    
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  // Obter notícias por categoria
  async getNewsByCategory(category, limit = 10) {
    try {
      const cacheKey = `news-${category}-${limit}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) return cached;

      const allNews = await this.getMainNews(50); // Obter mais notícias para filtrar
      const filteredNews = allNews.filter(news => 
        news.category === category || 
        news.title.toLowerCase().includes(category.toLowerCase()) ||
        news.description.toLowerCase().includes(category.toLowerCase())
      ).slice(0, limit);

      this.setCachedData(cacheKey, filteredNews);
      return filteredNews;
    } catch (error) {
      console.error(`Erro ao obter notícias da categoria ${category}:`, error);
      return this.getFallbackNewsByCategory(category, limit);
    }
  }

  // Obter notícias em tempo real
  async getLiveNews(limit = 5) {
    try {
      const cacheKey = `live-news-${limit}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) return cached;

      // Para notícias em tempo real, usar cache mais curto
      const news = await this.getMainNews(limit);
      
      this.setCachedData(cacheKey, news, 300000); // 5 minutos para notícias ao vivo
      return news;
    } catch (error) {
      console.error('Erro ao obter notícias em tempo real:', error);
      return this.getFallbackLiveNews(limit);
    }
  }

  // Buscar notícias por termo
  async searchNews(query, limit = 10) {
    try {
      const cacheKey = `search-${query}-${limit}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) return cached;

      const allNews = await this.getMainNews(100);
      const searchResults = allNews.filter(news => 
        news.title.toLowerCase().includes(query.toLowerCase()) ||
        news.description.toLowerCase().includes(query.toLowerCase()) ||
        news.content?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, limit);

      this.setCachedData(cacheKey, searchResults);
      return searchResults;
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
      return this.getFallbackSearchResults(query, limit);
    }
  }

  // Obter notícias de mercado (cotações, preços)
  async getMarketNews(limit = 10) {
    try {
      const cacheKey = `market-news-${limit}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) return cached;

      const allNews = await this.getMainNews(50);
      const marketNews = allNews.filter(news => 
        news.category === 'mercado' ||
        news.title.toLowerCase().includes('preço') ||
        news.title.toLowerCase().includes('cotação') ||
        news.title.toLowerCase().includes('dólar') ||
        news.title.toLowerCase().includes('exportação') ||
        news.title.toLowerCase().includes('importação')
      ).slice(0, limit);

      this.setCachedData(cacheKey, marketNews);
      return marketNews;
    } catch (error) {
      console.error('Erro ao obter notícias de mercado:', error);
      return this.getFallbackNewsByCategory('mercado', limit);
    }
  }

  // Obter notícias de clima
  async getWeatherNews(limit = 10) {
    try {
      const cacheKey = `weather-news-${limit}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) return cached;

      const allNews = await this.getMainNews(50);
      const weatherNews = allNews.filter(news => 
        news.category === 'clima' ||
        news.title.toLowerCase().includes('clima') ||
        news.title.toLowerCase().includes('chuva') ||
        news.title.toLowerCase().includes('seca') ||
        news.title.toLowerCase().includes('temperatura')
      ).slice(0, limit);

      this.setCachedData(cacheKey, weatherNews);
      return weatherNews;
    } catch (error) {
      console.error('Erro ao obter notícias de clima:', error);
      return this.getFallbackNewsByCategory('clima', limit);
    }
  }

  // Simular notícias principais (fallback)
  async getSimulatedNews(limit) {
    const categories = ['soja', 'milho', 'café', 'cana', 'gado', 'tecnologia', 'mercado', 'clima'];
    const news = [];

    for (let i = 0; i < limit; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
    const titles = {
        'soja': [
          'Soja: Preços sobem com forte demanda da China',
          'Exportação de soja brasileira atinge recorde',
          'Produtores de soja otimistas com safra 2024'
        ],
        'milho': [
          'Milho: Mercado em alta com estoques baixos',
          'Produção de milho deve crescer 15% este ano',
          'Exportação de milho brasileiro aumenta 20%'
        ],
        'café': [
          'Café: Preços em alta com geada no Brasil',
          'Produção de café arábica deve cair 30%',
          'Exportação de café atinge melhor resultado em 5 anos'
        ],
        'cana': [
          'Cana-de-açúcar: Safra deve crescer 8%',
          'Etanol: Preços em alta com demanda crescente',
          'Usinas de açúcar investem em tecnologia'
        ],
        'gado': [
          'Gado: Preços da arroba em alta',
          'Exportação de carne bovina cresce 25%',
          'Frigoríficos investem em rastreabilidade'
        ],
        'tecnologia': [
          'Agricultura 4.0: Drones revolucionam plantio',
          'IoT na agricultura: Sensores monitoram solo',
          'Blockchain rastreia origem dos alimentos'
        ],
        'mercado': [
          'Dólar cai e favorece exportações agrícolas',
          'Commodities agrícolas em alta na bolsa',
          'Mercado futuro registra recorde de negociações'
        ],
        'clima': [
          'La Niña deve trazer mais chuvas ao Sul',
          'Temperaturas devem ficar acima da média',
          'Previsão de chuvas regulares para plantio'
        ]
      };

      const descriptions = {
        'soja': 'Análise completa do mercado de soja com preços, tendências e perspectivas para o agronegócio brasileiro.',
        'milho': 'Cenário atual do mercado de milho com foco na produção, exportação e preços para produtores.',
        'café': 'Mercado do café em alta com geada e perspectivas de produção para a safra 2024/2025.',
        'cana': 'Setor sucroenergético em expansão com investimentos em tecnologia e aumento da produção.',
        'gado': 'Pecuária brasileira em crescimento com forte demanda externa e investimentos em qualidade.',
        'tecnologia': 'Inovações tecnológicas transformam a agricultura brasileira com foco em produtividade.',
        'mercado': 'Análise macroeconômica do agronegócio com foco em câmbio e commodities.',
        'clima': 'Previsões climáticas para o agronegócio com impactos na produção agrícola.'
      };

      const title = titles[category][Math.floor(Math.random() * titles[category].length)];
      const description = descriptions[category];

      news.push({
        id: `simulated-${i}`,
        title,
        description,
        content: `${title}. ${description} Esta é uma notícia simulada para demonstração do sistema AgroSync.`,
        link: '#',
        publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        source: 'AgroSync',
        category,
        image: `/images/news/${category}.jpg`,
        author: 'Equipe AgroSync',
        readTime: Math.floor(Math.random() * 5) + 2
      });
    }

    return news;
  }

  // Dados de fallback para categorias
  getFallbackNewsByCategory(category, limit) {
    const allNews = this.getFallbackNews(limit * 2);
    return allNews.filter(news => news.category === category).slice(0, limit);
  }

  // Dados de fallback para notícias ao vivo
  getFallbackLiveNews(limit) {
    return this.getFallbackNews(limit);
  }

  // Dados de fallback para busca
  getFallbackSearchResults(query, limit) {
    const allNews = this.getFallbackNews(limit * 2);
    return allNews.filter(news => 
      news.title.toLowerCase().includes(query.toLowerCase()) ||
      news.description.toLowerCase().includes(query.toLowerCase())
    ).slice(0, limit);
  }

  // Dados de fallback gerais
  getFallbackNews(limit) {
    const fallbackNews = [
      {
        id: 'fallback-1',
        title: 'Mercado agrícola em alta com forte demanda',
        description: 'Commodities agrícolas registram alta expressiva com forte demanda internacional.',
        content: 'O mercado agrícola brasileiro registra alta expressiva com forte demanda internacional por produtos brasileiros.',
        link: '#',
        publishedAt: new Date(),
        source: 'AgroSync',
        category: 'mercado',
        image: '/images/news/mercado.jpg',
        author: 'Equipe AgroSync',
        readTime: 3
      },
      {
        id: 'fallback-2',
        title: 'Tecnologia revoluciona agricultura brasileira',
        description: 'Novas tecnologias aumentam produtividade no campo.',
        content: 'A agricultura brasileira está sendo revolucionada por novas tecnologias que aumentam significativamente a produtividade.',
        link: '#',
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      source: 'AgroSync',
        category: 'tecnologia',
        image: '/images/news/tecnologia.jpg',
        author: 'Equipe AgroSync',
        readTime: 4
      }
    ];

    return fallbackNews.slice(0, limit);
  }

  // Gerenciamento de cache
  getCachedData(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < (cached.timeout || this.cacheTimeout)) {
      return cached.data;
    }
    return null;
  }

  setCachedData(key, data, timeout = null) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      timeout: timeout || this.cacheTimeout
    });
  }

  // Limpar cache
  clearCache() {
    this.cache.clear();
  }

  // Obter estatísticas do cache
  getCacheStats() {
    const keys = Array.from(this.cache.keys());
    const totalItems = keys.length;
    const totalSize = keys.reduce((size, key) => {
      const item = this.cache.get(key);
      return size + JSON.stringify(item.data).length;
    }, 0);

    return {
      totalItems,
      totalSize: `${(totalSize / 1024).toFixed(2)} KB`,
      cacheTimeout: `${this.cacheTimeout / 1000 / 60} minutos`
    };
  }
}

const newsService = new NewsService();
export default newsService;
