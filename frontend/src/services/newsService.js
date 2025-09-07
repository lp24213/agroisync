import axios from 'axios';

class NewsService {
  constructor() {
    this.apiKey = process.env.REACT_APP_NEWS_API_KEY;
    this.baseUrl = 'https://newsapi.org/v2';
    this.globoRuralUrl = 'https://g1.globo.com/rss/g1/economia/agronegocios/';
    this.isLoading = false;
    this.error = null;
    this.cache = new Map();
    this.cacheTimeout = 30 * 60 * 1000; // 30 minutos
  }

  // Buscar notícias do agronegócio
  async getAgroNews(limit = 10) {
    const cacheKey = `agro-news-${limit}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      this.isLoading = true;
      this.error = null;

      let newsData;
      
      if (this.apiKey) {
        try {
          newsData = await this.fetchNewsAPI(limit);
        } catch (apiError) {
          console.warn('Erro na NewsAPI, usando dados mockados:', apiError);
          newsData = this.getMockNews(limit);
        }
      } else {
        console.warn('API Key da NewsAPI não configurada, usando dados mockados');
        newsData = this.getMockNews(limit);
      }

      // Cache dos dados
      this.cache.set(cacheKey, {
        data: newsData,
        timestamp: Date.now()
      });

      return newsData;
    } catch (error) {
      console.error('Erro ao obter notícias:', error);
      this.error = error.message;
      return this.getMockNews(limit);
    } finally {
      this.isLoading = false;
    }
  }

  // Buscar notícias da NewsAPI
  async fetchNewsAPI(limit) {
    const response = await axios.get(`${this.baseUrl}/everything`, {
      params: {
        q: 'agronegócio OR agricultura OR commodities OR soja OR milho OR café OR pecuária',
        language: 'pt',
        sortBy: 'publishedAt',
        pageSize: limit,
        apiKey: this.apiKey
      }
    });

    return this.formatNewsData(response.data.articles);
  }

  // Formatar dados da NewsAPI
  formatNewsData(articles) {
    return articles.map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      publishedAt: new Date(article.publishedAt),
      source: article.source.name,
      category: this.categorizeNews(article.title, article.description),
      imageUrl: article.urlToImage,
      author: article.author
    }));
  }

  // Categorizar notícias
  categorizeNews(title, description) {
    const text = `${title} ${description}`.toLowerCase();
    
    if (text.includes('soja') || text.includes('milho') || text.includes('grãos')) {
      return 'Grãos';
    } else if (text.includes('café') || text.includes('cafe')) {
      return 'Café';
    } else if (text.includes('pecuária') || text.includes('boi') || text.includes('gado')) {
      return 'Pecuária';
    } else if (text.includes('clima') || text.includes('tempo') || text.includes('chuva')) {
      return 'Clima';
    } else if (text.includes('preço') || text.includes('cotação') || text.includes('mercado')) {
      return 'Mercado';
    } else if (text.includes('tecnologia') || text.includes('digital') || text.includes('inovação')) {
      return 'Tecnologia';
    } else {
      return 'Agronegócio';
    }
  }

  // Gerar notícias mockadas
  getMockNews(limit) {
    const mockNews = [
      {
        title: 'Soja atinge novo recorde de preço na B3',
        description: 'Commodity brasileira registra alta de 3,2% nesta semana, impulsionada pela demanda internacional.',
        url: '#',
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        source: 'AgroSync News',
        category: 'Grãos',
        imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
        author: 'Redação AgroSync'
      },
      {
        title: 'Tecnologia 5G revoluciona agricultura de precisão',
        description: 'Fazendas no Mato Grosso implementam soluções IoT para monitoramento em tempo real.',
        url: '#',
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        source: 'AgroSync News',
        category: 'Tecnologia',
        imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400',
        author: 'Redação AgroSync'
      },
      {
        title: 'Previsão de chuva favorece plantio de milho',
        description: 'Meteorologistas indicam condições ideais para o início da safra 2024/25.',
        url: '#',
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        source: 'AgroSync News',
        category: 'Clima',
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
        author: 'Redação AgroSync'
      }
    ];

    return mockNews.slice(0, limit);
  }
}

const newsService = new NewsService();
export default newsService;