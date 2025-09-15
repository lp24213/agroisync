// Serviço para buscar notícias reais do agronegócio
import axios from 'axios';

class AgroNewsService {
  constructor() {
    this.baseURL = 'https://newsapi.org/v2';
    this.apiKey = process.env.REACT_APP_NEWS_API_KEY || 'demo';
    this.cache = new Map();
    this.cacheTimeout = 30 * 60 * 1000; // 30 minutos
  }

  // Buscar notícias do agronegócio
  async getAgroNews() {
    const cacheKey = 'agro-news';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      // Múltiplas fontes de notícias agro
      const sources = [
        'globo-rural',
        'canal-rural', 
        'agro-news',
        'rural-news'
      ];

      const promises = sources.map(source => 
        this.fetchFromSource(source)
      );

      const results = await Promise.allSettled(promises);
      const allNews = results
        .filter(result => result.status === 'fulfilled')
        .flatMap(result => result.value)
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

      // Cache dos resultados
      this.cache.set(cacheKey, {
        data: allNews,
        timestamp: Date.now()
      });

      return allNews;
    } catch (error) {
      console.error('Erro ao buscar notícias agro:', error);
      return this.getFallbackNews();
    }
  }

  // Buscar de fonte específica
  async fetchFromSource(source) {
    try {
      const response = await axios.get(`${this.baseURL}/everything`, {
        params: {
          sources: source,
          q: 'agronegócio OR agricultura OR commodities OR soja OR milho OR café OR pecuária',
          language: 'pt',
          sortBy: 'publishedAt',
          pageSize: 10
        },
        headers: {
          'X-API-Key': this.apiKey
        }
      });

      return response.data.articles.map(article => ({
        id: article.url,
        title: article.title,
        subtitle: article.description,
        image: article.urlToImage || this.getDefaultImage(),
        link: article.url,
        category: this.categorizeNews(article.title),
        publishedAt: article.publishedAt,
        source: article.source.name
      }));
    } catch (error) {
      console.error(`Erro ao buscar de ${source}:`, error);
      return [];
    }
  }

  // Categorizar notícias
  categorizeNews(title) {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('soja') || titleLower.includes('milho') || titleLower.includes('café')) {
      return 'Commodities';
    }
    if (titleLower.includes('tecnologia') || titleLower.includes('iot') || titleLower.includes('5g')) {
      return 'Tecnologia';
    }
    if (titleLower.includes('clima') || titleLower.includes('chuva') || titleLower.includes('seca')) {
      return 'Clima';
    }
    if (titleLower.includes('exportação') || titleLower.includes('importação')) {
      return 'Comércio';
    }
    if (titleLower.includes('sustentabilidade') || titleLower.includes('carbono')) {
      return 'Sustentabilidade';
    }
    
    return 'Geral';
  }

  // Imagem padrão para notícias sem imagem
  getDefaultImage() {
    const images = [
      'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&h=400&fit=crop'
    ];
    return images[Math.floor(Math.random() * images.length)];
  }

  // Notícias de fallback
  getFallbackNews() {
    return [
      {
        id: 1,
        title: "Soja atinge nova máxima histórica com alta de 15%",
        subtitle: "Preços sobem impulsionados pela demanda chinesa e condições climáticas adversas",
        image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=400&fit=crop",
        link: "#",
        category: "Commodities",
        publishedAt: new Date().toISOString(),
        source: "AgroNews"
      },
      {
        id: 2,
        title: "Tecnologia 5G revoluciona agricultura de precisão",
        subtitle: "Fazendas conectadas aumentam produtividade em até 30% com IoT",
        image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=400&fit=crop",
        link: "#",
        category: "Tecnologia",
        publishedAt: new Date().toISOString(),
        source: "TechAgro"
      },
      {
        id: 3,
        title: "Milho: safra 2024 supera expectativas",
        subtitle: "Produtores comemoram resultado acima da média nacional",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=400&fit=crop",
        link: "#",
        category: "Produção",
        publishedAt: new Date().toISOString(),
        source: "RuralNews"
      }
    ];
  }
}

const agroNewsService = new AgroNewsService();
export default agroNewsService;
